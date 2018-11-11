/*
 * This file is generated by jOOQ.
 */
package com.greenleaf.metis.medical.jooq.generated.tables;


import com.greenleaf.metis.medical.jooq.generated.Keys;
import com.greenleaf.metis.medical.jooq.generated.Public;
import com.greenleaf.metis.medical.jooq.generated.tables.records.VignetteSpecialtyRecord;

import java.util.Arrays;
import java.util.List;

import javax.annotation.Generated;

import org.jooq.Field;
import org.jooq.ForeignKey;
import org.jooq.Name;
import org.jooq.Record;
import org.jooq.Schema;
import org.jooq.Table;
import org.jooq.TableField;
import org.jooq.UniqueKey;
import org.jooq.impl.DSL;
import org.jooq.impl.TableImpl;


/**
 * This class is generated by jOOQ.
 */
@Generated(
    value = {
        "http://www.jooq.org",
        "jOOQ version:3.11.5"
    },
    comments = "This class is generated by jOOQ"
)
@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class VignetteSpecialty extends TableImpl<VignetteSpecialtyRecord> {

    private static final long serialVersionUID = -2047421830;

    /**
     * The reference instance of <code>public.vignette_specialty</code>
     */
    public static final VignetteSpecialty VIGNETTE_SPECIALTY = new VignetteSpecialty();

    /**
     * The class holding records for this type
     */
    @Override
    public Class<VignetteSpecialtyRecord> getRecordType() {
        return VignetteSpecialtyRecord.class;
    }

    /**
     * The column <code>public.vignette_specialty.vignette_id</code>.
     */
    public final TableField<VignetteSpecialtyRecord, Integer> VIGNETTE_ID = createField("vignette_id", org.jooq.impl.SQLDataType.INTEGER.nullable(false), this, "");

    /**
     * The column <code>public.vignette_specialty.specialty_id</code>.
     */
    public final TableField<VignetteSpecialtyRecord, Integer> SPECIALTY_ID = createField("specialty_id", org.jooq.impl.SQLDataType.INTEGER.nullable(false), this, "");

    /**
     * Create a <code>public.vignette_specialty</code> table reference
     */
    public VignetteSpecialty() {
        this(DSL.name("vignette_specialty"), null);
    }

    /**
     * Create an aliased <code>public.vignette_specialty</code> table reference
     */
    public VignetteSpecialty(String alias) {
        this(DSL.name(alias), VIGNETTE_SPECIALTY);
    }

    /**
     * Create an aliased <code>public.vignette_specialty</code> table reference
     */
    public VignetteSpecialty(Name alias) {
        this(alias, VIGNETTE_SPECIALTY);
    }

    private VignetteSpecialty(Name alias, Table<VignetteSpecialtyRecord> aliased) {
        this(alias, aliased, null);
    }

    private VignetteSpecialty(Name alias, Table<VignetteSpecialtyRecord> aliased, Field<?>[] parameters) {
        super(alias, null, aliased, parameters, DSL.comment(""));
    }

    public <O extends Record> VignetteSpecialty(Table<O> child, ForeignKey<O, VignetteSpecialtyRecord> key) {
        super(child, key, VIGNETTE_SPECIALTY);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Schema getSchema() {
        return Public.PUBLIC;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public UniqueKey<VignetteSpecialtyRecord> getPrimaryKey() {
        return Keys.VIGNETTE_SPECIALTY_PK;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<UniqueKey<VignetteSpecialtyRecord>> getKeys() {
        return Arrays.<UniqueKey<VignetteSpecialtyRecord>>asList(Keys.VIGNETTE_SPECIALTY_PK);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<ForeignKey<VignetteSpecialtyRecord, ?>> getReferences() {
        return Arrays.<ForeignKey<VignetteSpecialtyRecord, ?>>asList(Keys.VIGNETTE_SPECIALTY__FK_VIG_SPE_VIG, Keys.VIGNETTE_SPECIALTY__FK_VIG_SPE_SPEC);
    }

    public Vignette vignette() {
        return new Vignette(this, Keys.VIGNETTE_SPECIALTY__FK_VIG_SPE_VIG);
    }

    public Specialty specialty() {
        return new Specialty(this, Keys.VIGNETTE_SPECIALTY__FK_VIG_SPE_SPEC);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public VignetteSpecialty as(String alias) {
        return new VignetteSpecialty(DSL.name(alias), this);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public VignetteSpecialty as(Name alias) {
        return new VignetteSpecialty(alias, this);
    }

    /**
     * Rename this table
     */
    @Override
    public VignetteSpecialty rename(String name) {
        return new VignetteSpecialty(DSL.name(name), null);
    }

    /**
     * Rename this table
     */
    @Override
    public VignetteSpecialty rename(Name name) {
        return new VignetteSpecialty(name, null);
    }
}
